import React, {useEffect, useMemo, useState} from 'react';
import {Box, Text, useApp, useInput, useStdin} from 'ink';
import {ConfirmInput, Spinner, TextInput} from '@inkjs/ui';
import {appInfo, exerciseCategories, getAboutText, installActions, mainMenuItems} from './config.js';
import {collectDependencyStatuses} from './dependencies.js';
import {exercises, listExercisesByCategory} from './exercises.js';
import {runCapturedCommand, runTerminalCommand} from './runner.js';
import {normalizeInteger, truncateOutput} from './utils.js';

const h = React.createElement;

// ─── navigation hook ────────────────────────────────────────────────────────

function useMenuNavigation(items, onSelect, {onBack, onQuit, isActive = true} = {}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [items]);

  useInput(
    (input, key) => {
      if (!items.length) {
        return;
      }

      if (key.upArrow || input === 'k') {
        setIndex(current => (current - 1 + items.length) % items.length);
        return;
      }

      if (key.downArrow || input === 'j') {
        setIndex(current => (current + 1) % items.length);
        return;
      }

      if (key.return) {
        onSelect(items[index], index);
        return;
      }

      if (input === 'q' && onQuit) {
        onQuit();
        return;
      }

      if ((key.escape || input === 'b') && onBack) {
        onBack();
      }
    },
    {isActive}
  );

  return index;
}

// ─── shared primitives ───────────────────────────────────────────────────────

function Header({title, subtitle}) {
  return h(Box, {flexDirection: 'column', marginBottom: 1}, [
    h(Text, {key: 'title', bold: true, color: 'cyanBright'}, `◆  ${title}`),
    subtitle
      ? h(Text, {key: 'subtitle', color: 'cyan', dimColor: true}, `   ${subtitle}`)
      : null
  ]);
}

function Footer({text}) {
  return h(Box, {marginTop: 1}, [
    h(Text, {key: 'f', dimColor: true}, `   ${text}`)
  ]);
}

function Frame({title, subtitle, children, footer}) {
  return h(Box, {flexDirection: 'column', paddingX: 1, paddingTop: 1, paddingBottom: 1}, [
    h(Header, {key: 'hdr', title, subtitle}),
    h(Box, {key: 'body', flexDirection: 'column'}, children),
    footer ? h(Footer, {key: 'ftr', text: footer}) : null
  ]);
}

function MenuList({items, index}) {
  const start = Math.max(0, index - 5);
  const visible = items.slice(start, start + 10);
  const hasAbove = start > 0;
  const hasBelow = start + 10 < items.length;

  return h(Box, {flexDirection: 'column'}, [
    hasAbove
      ? h(Text, {key: 'above', dimColor: true}, '   ↑ más elementos arriba')
      : null,
    ...visible.map((item, offset) => {
      const actualIndex = start + offset;
      const selected = actualIndex === index;

      return h(Box, {
        key: item.id ?? `${item.label}-${actualIndex}`,
        flexDirection: 'column',
        marginBottom: 1
      }, [
        h(Box, {key: 'row', flexDirection: 'row'}, [
          h(Text, {key: 'arrow', color: 'green', bold: true}, selected ? ' ❯ ' : '   '),
          h(Text, {
            key: 'label',
            color: selected ? 'greenBright' : 'white',
            bold: selected
          }, item.label)
        ]),
        item.description
          ? h(Box, {key: 'desc', paddingLeft: 3}, [
              h(Text, {key: 'dt', dimColor: true}, item.description)
            ])
          : null
      ]);
    }),
    hasBelow
      ? h(Text, {key: 'below', dimColor: true}, '   ↓ más elementos abajo')
      : null
  ]);
}

function StatusBox({title, lines, color = 'cyan'}) {
  return h(Box, {
    flexDirection: 'column',
    marginTop: 1,
    borderStyle: 'round',
    borderColor: color,
    paddingX: 1
  }, [
    h(Text, {key: 'title', bold: true, color: 'yellowBright'}, title),
    ...lines.map((line, i) => h(Text, {key: `${title}-${i}`, dimColor: true}, line))
  ]);
}

function Badge({ok, label}) {
  return h(Box, {flexDirection: 'row', gap: 1}, [
    h(Text, {key: 'icon', color: ok ? 'greenBright' : 'redBright', bold: true}, ok ? '✔' : '✖'),
    h(Text, {key: 'lbl', color: ok ? 'greenBright' : 'redBright', bold: !ok}, label)
  ]);
}

// ─── screens ─────────────────────────────────────────────────────────────────

function MainScreen({lastDependencySummary, lastResult, onQuit, onSelect}) {
  const index = useMenuNavigation(mainMenuItems, onSelect, {isActive: true, onQuit});

  const depsOk = lastDependencySummary?.okCount === lastDependencySummary?.total;
  const depsColor = !lastDependencySummary ? 'cyan' : depsOk ? 'green' : 'yellow';
  const summaryLines = lastDependencySummary
    ? [`${lastDependencySummary.okCount}/${lastDependencySummary.total} checks en verde`]
    : ['Todavía no corriste la verificación.'];

  const resultColor = !lastResult ? 'cyan' : lastResult.success ? 'green' : 'red';
  const resultLines = lastResult
    ? [`${lastResult.success ? '✔' : '✖'} ${lastResult.title}`]
    : ['Todavía no ejecutaste ninguna acción.'];

  return h(Frame, {
    title: appInfo.title,
    subtitle: appInfo.subtitle,
    footer: '↑↓  j k  mover   ⏎ seleccionar   q salir'
  }, [
    h(MenuList, {key: 'menu', items: mainMenuItems, index}),
    h(StatusBox, {key: 'deps', title: 'Dependencias', lines: summaryLines, color: depsColor}),
    h(StatusBox, {key: 'result', title: 'Último resultado', lines: resultLines, color: resultColor})
  ]);
}

function DependencyScreen({onBack, onQuit, onRefreshDone}) {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const actions = useMemo(
    () => [
      {id: 'refresh', label: 'Revisar otra vez', description: 'Vuelve a ejecutar todos los checks.'},
      {id: 'back', label: 'Volver', description: 'Regresa al menú principal.'}
    ],
    []
  );

  const load = async () => {
    setLoading(true);
    const status = await collectDependencyStatuses();
    setSummary(status);
    onRefreshDone(status);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const index = useMenuNavigation(
    actions,
    item => {
      if (item.id === 'refresh') {
        void load();
        return;
      }

      onBack();
    },
    {onBack, onQuit, isActive: !loading}
  );

  if (loading) {
    return h(Frame, {
      title: 'Verificación de dependencias',
      subtitle: 'Chequeando sistema y proyecto...',
      footer: 'Esc · b  volver'
    }, [h(Spinner, {key: 'spinner', label: 'Revisando dependencias...'})]);
  }

  const allOk = summary.okCount === summary.total;

  return h(Frame, {
    title: 'Verificación de dependencias',
    subtitle: `${summary.okCount}/${summary.total} checks en verde`,
    footer: '↑↓  j k  mover   ⏎ seleccionar   Esc · b  volver'
  }, [
    h(Box, {
      key: 'summary-badge',
      borderStyle: 'round',
      borderColor: allOk ? 'green' : 'yellow',
      paddingX: 1,
      marginBottom: 1
    }, [
      h(Text, {bold: true, color: allOk ? 'greenBright' : 'yellowBright'},
        allOk
          ? `  ✔  Todo en orden — ${summary.total}/${summary.total} checks OK`
          : `  ⚠  ${summary.total - summary.okCount} de ${summary.total} checks fallaron`)
    ]),
    h(Box, {key: 'status-list', flexDirection: 'column', marginBottom: 1},
      summary.items.map(item =>
        h(Box, {key: item.id, flexDirection: 'column', marginBottom: 1}, [
          h(Badge, {key: 'badge', ok: item.ok, label: item.label}),
          h(Box, {key: 'detail', paddingLeft: 2}, [
            h(Text, {key: 'dt', dimColor: true}, item.detail)
          ])
        ])
      )
    ),
    h(MenuList, {key: 'actions', items: actions, index})
  ]);
}

function InstallScreen({onBack, onQuit, onSelect}) {
  const index = useMenuNavigation(installActions, onSelect, {onBack, onQuit});

  return h(Frame, {
    title: 'Instalar / preparar entorno',
    subtitle: 'Las acciones con apt/rpcbind usan terminal interactiva y pueden pedir sudo.',
    footer: '↑↓  j k  mover   ⏎ seleccionar   Esc · b  volver'
  }, [h(MenuList, {key: 'menu', items: installActions, index})]);
}

function CategoryScreen({onBack, onQuit, onSelect}) {
  const index = useMenuNavigation(exerciseCategories, onSelect, {onBack, onQuit});

  return h(Frame, {
    title: 'Ejecutar incisos prácticos',
    subtitle: 'Elegí una familia de ejercicios.',
    footer: '↑↓  j k  mover   ⏎ seleccionar   Esc · b  volver'
  }, [h(MenuList, {key: 'menu', items: exerciseCategories, index})]);
}

function ExerciseScreen({categoryId, onBack, onQuit, onSelect}) {
  const items = listExercisesByCategory(categoryId);
  const category = exerciseCategories.find(item => item.id === categoryId);
  const index = useMenuNavigation(items, onSelect, {onBack, onQuit});

  return h(Frame, {
    title: category?.label ?? 'Ejercicios',
    subtitle: `${items.length} inciso(s) disponibles`,
    footer: '↑↓  j k  mover   ⏎ seleccionar   Esc · b  volver'
  }, [h(MenuList, {key: 'menu', items, index})]);
}

function ConfirmScreen({title, body, onConfirm, onCancel}) {
  return h(Frame, {
    title,
    subtitle: body,
    footer: 'y confirmar   n cancelar'
  }, [
    h(Box, {key: 'hint', marginBottom: 1}, [
      h(Text, {color: 'yellowBright', bold: true}, '  ¿Querés continuar?')
    ]),
    h(ConfirmInput, {key: 'confirm', onConfirm, onCancel})
  ]);
}

function PromptScreen({exercise, onBack, onSubmit}) {
  const prompts = exercise.prompts ?? [];
  const [stepIndex, setStepIndex] = useState(0);
  const [values, setValues] = useState({});
  const current = prompts[stepIndex];

  const finishStep = rawValue => {
    let value = rawValue;

    if ((value === '' || value == null) && current.defaultValue != null) {
      value = current.defaultValue;
    }

    try {
      if (current.type === 'number') {
        value = normalizeInteger(value);
      }

      const nextValues = {...values, [current.name]: value};

      if (stepIndex === prompts.length - 1) {
        onSubmit(nextValues);
        return;
      }

      setValues(nextValues);
      setStepIndex(currentIndex => currentIndex + 1);
    } catch (error) {
      onSubmit({__error: error.message});
    }
  };

  if (!current) {
    onSubmit(values);
    return null;
  }

  if (current.type === 'select') {
    const index = useMenuNavigation(current.options, option => finishStep(option.value), {onBack});
    return h(Frame, {
      title: exercise.title,
      subtitle: current.label,
      footer: '↑↓  j k  mover   ⏎ seleccionar   Esc · b  volver'
    }, [h(MenuList, {key: 'menu', items: current.options, index})]);
  }

  return h(Frame, {
    title: exercise.title,
    subtitle: current.label,
    footer: current.defaultValue != null
      ? `Enter vacío = ${current.defaultValue}`
      : 'Escribí y Enter para enviar'
  }, [
    h(Box, {key: 'q', marginBottom: 1}, [
      h(Text, {color: 'cyanBright'}, `  ${current.label}`)
    ]),
    h(TextInput, {key: 'input', placeholder: String(current.defaultValue ?? ''), onSubmit: finishStep})
  ]);
}

function RunningScreen({label}) {
  return h(Frame, {
    title: 'Ejecutando...',
    subtitle: label,
    footer: 'Esperá a que termine la acción.'
  }, [
    h(Box, {key: 'spinner-wrap', marginTop: 1, paddingX: 1}, [
      h(Spinner, {key: 'spinner', label})
    ])
  ]);
}

function ResultScreen({result, onBack, onQuit, onRetry}) {
  const actions = [
    {id: 'retry', label: 'Repetir', description: 'Vuelve a ejecutar la misma acción.'},
    {id: 'back', label: 'Volver', description: 'Regresa a la pantalla anterior.'}
  ];
  const index = useMenuNavigation(
    actions,
    item => {
      if (item.id === 'retry') {
        onRetry();
        return;
      }

      onBack();
    },
    {onBack, onQuit}
  );

  const ok = result.success;

  return h(Frame, {
    title: result.title,
    subtitle: ok ? 'Resultado: OK' : 'Resultado: FALLÓ',
    footer: '↑↓  j k  mover   ⏎ seleccionar   Esc · b  volver'
  }, [
    h(Box, {
      key: 'status-badge',
      borderStyle: 'round',
      borderColor: ok ? 'green' : 'red',
      paddingX: 2,
      marginBottom: 1
    }, [
      h(Text, {key: 'st', bold: true, color: ok ? 'greenBright' : 'redBright'},
        ok ? '  ✔  Acción completada exitosamente' : '  ✖  La acción falló')
    ]),
    h(Box, {
      key: 'output',
      flexDirection: 'column',
      marginBottom: 1,
      borderStyle: 'round',
      borderColor: 'blue',
      paddingX: 1
    }, [
      h(Text, {key: 'out-title', bold: true, color: 'cyanBright'}, 'Salida'),
      ...truncateOutput(result.output).split('\n').map((line, i) =>
        h(Text, {key: `line-${i}`, dimColor: true}, line)
      )
    ]),
    h(MenuList, {key: 'actions', items: actions, index})
  ]);
}

function AboutScreen({onBack, onQuit}) {
  const lines = getAboutText().split('\n');

  useInput((input, key) => {
    if (input === 'q') {
      onQuit();
      return;
    }

    if (key.escape || key.return || input === 'b') {
      onBack();
    }
  });

  return h(Frame, {
    title: 'Resumen / ayuda',
    subtitle: 'Alcance real de la TUI',
    footer: '⏎ · Esc · b  volver'
  }, [
    h(Box, {
      key: 'content',
      flexDirection: 'column',
      borderStyle: 'round',
      borderColor: 'cyan',
      paddingX: 1
    },
      lines.map((line, i) =>
        h(Text, {
          key: i,
          color: line.startsWith('-') ? undefined : line.startsWith('Qué') ? 'yellowBright' : undefined,
          bold: line.startsWith('Sistema') || line.startsWith('Qué'),
          dimColor: line.startsWith('-')
        }, line || ' ')
      )
    )
  ]);
}

// ─── root ─────────────────────────────────────────────────────────────────────

export function App() {
  const {exit} = useApp();
  const {setRawMode, isRawModeSupported} = useStdin();
  const [stack, setStack] = useState([{type: 'main'}]);
  const [lastDependencySummary, setLastDependencySummary] = useState(null);
  const [lastResult, setLastResult] = useState(null);

  const screen = stack[stack.length - 1];

  const push = next => setStack(current => [...current, next]);
  const replace = next => setStack(current => [...current.slice(0, -1), next]);
  const pop = () => setStack(current => (current.length > 1 ? current.slice(0, -1) : current));

  const executeInstall = async action => {
    replace({type: 'running', label: action.label});
    const result = action.mode === 'terminal'
      ? await runTerminalCommand(action.command, {cwd: action.cwd, setRawMode})
      : await runCapturedCommand(action.command, {cwd: action.cwd});

    const finalResult = {
      title: action.label,
      success: result.success,
      output: result.output || action.description,
      retry: {kind: 'install', item: action}
    };

    setLastResult(finalResult);
    replace({type: 'result', result: finalResult});
  };

  const executeExercise = async (exercise, values) => {
    if (values?.__error) {
      const finalResult = {
        title: exercise.title,
        success: false,
        output: values.__error,
        retry: {kind: 'exercise', item: exercise}
      };

      setLastResult(finalResult);
      replace({type: 'result', result: finalResult});
      return;
    }

    replace({type: 'running', label: exercise.title});
    const result = await exercise.run(values ?? {}, {setRawMode});
    const finalResult = {
      title: exercise.title,
      success: result.success,
      output: result.output,
      retry: {kind: 'exercise', item: exercise, values}
    };

    setLastResult(finalResult);
    replace({type: 'result', result: finalResult});
  };

  if (!isRawModeSupported) {
    return h(Frame, {
      title: appInfo.title,
      subtitle: 'Modo no interactivo detectado',
      footer: 'Ejecutá esta TUI en una terminal real (TTY).'
    }, [
      h(Text, {key: 'line-1', color: 'yellowBright', bold: true}, '  ⚠  Ink no puede activar raw mode en este stdin.'),
      h(Text, {key: 'line-2', dimColor: true}, '  Eso pasa al redirigir stdin o correr desde runners automatizados.'),
      h(Text, {key: 'line-3', dimColor: true}, `  Probá: cd practicorpc/98-tui-practica && npm start`)
    ]);
  }

  if (screen.type === 'main') {
    return h(MainScreen, {
      lastDependencySummary,
      lastResult,
      onQuit: exit,
      onSelect: item => {
        if (item.id === 'dependencies') {
          push({type: 'dependencies'});
          return;
        }

        if (item.id === 'install') {
          push({type: 'install'});
          return;
        }

        if (item.id === 'exercises') {
          push({type: 'categories'});
          return;
        }

        if (item.id === 'about') {
          push({type: 'about'});
          return;
        }

        exit();
      }
    });
  }

  if (screen.type === 'dependencies') {
    return h(DependencyScreen, {
      onBack: pop,
      onQuit: exit,
      onRefreshDone: setLastDependencySummary
    });
  }

  if (screen.type === 'install') {
    return h(InstallScreen, {
      onBack: pop,
      onQuit: exit,
      onSelect: action => push({type: 'confirm-install', action})
    });
  }

  if (screen.type === 'confirm-install') {
    return h(ConfirmScreen, {
      title: screen.action.label,
      body: screen.action.description,
      onConfirm: () => void executeInstall(screen.action),
      onCancel: pop
    });
  }

  if (screen.type === 'categories') {
    return h(CategoryScreen, {
      onBack: pop,
      onQuit: exit,
      onSelect: category => push({type: 'exercise-list', categoryId: category.id})
    });
  }

  if (screen.type === 'exercise-list') {
    return h(ExerciseScreen, {
      categoryId: screen.categoryId,
      onBack: pop,
      onQuit: exit,
      onSelect: exercise => {
        if (exercise.prompts?.length) {
          push({type: 'prompt', exercise});
          return;
        }

        push({type: 'running', label: exercise.title});
        void executeExercise(exercise, {});
      }
    });
  }

  if (screen.type === 'prompt') {
    return h(PromptScreen, {
      exercise: screen.exercise,
      onBack: pop,
      onSubmit: values => void executeExercise(screen.exercise, values)
    });
  }

  if (screen.type === 'running') {
    return h(RunningScreen, {label: screen.label});
  }

  if (screen.type === 'result') {
    return h(ResultScreen, {
      result: screen.result,
      onBack: pop,
      onQuit: exit,
      onRetry: () => {
        const retry = screen.result.retry;
        if (retry.kind === 'install') {
          void executeInstall(retry.item);
          return;
        }

        void executeExercise(retry.item, retry.values ?? {});
      }
    });
  }

  return h(AboutScreen, {onBack: pop, onQuit: exit});
}
