const panelRoot = document.querySelector("#panels");

if (panelRoot) {
  const panels = Array.from(panelRoot.querySelectorAll("[data-panel]"));
  const viewer = document.querySelector("[data-panel-viewer]");
  const viewerContent = viewer?.querySelector("[data-panel-dialog-content]") || null;
  const html = document.documentElement;
  const panelFadeDuration = 220;

  if (panels.length) {
    let activeIndex = Math.max(0, panels.findIndex((panel) => !panel.hidden));
    let isTransitioning = false;

    const setAudioButtonState = (button, isPlaying) => {
      if (!button) {
        return;
      }

      const label = button.querySelector("[data-panel-audio-label]");
      const nextLabel = isPlaying
        ? button.getAttribute("data-audio-label-pause") || "Pause excerpt"
        : button.getAttribute("data-audio-label-play") || "Play excerpt";

      button.setAttribute("aria-pressed", String(isPlaying));

      if (label) {
        label.textContent = nextLabel;
        return;
      }

      button.textContent = nextLabel;
    };

    const resetAllAudio = () => {
      document.querySelectorAll("#panels audio, [data-panel-viewer] audio").forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;
      });

      document.querySelectorAll("#panels [data-panel-audio-toggle], [data-panel-viewer] [data-panel-audio-toggle]").forEach((button) => {
        setAudioButtonState(button, false);
      });
    };

    const bindAudioScope = (scope) => {
      scope.querySelectorAll("audio").forEach((audio) => {
        if (audio.dataset.panelAudioBound === "true") {
          return;
        }

        audio.dataset.panelAudioBound = "true";

        audio.addEventListener("play", () => {
          const button = audio.closest("[data-panel]")?.querySelector("[data-panel-audio-toggle]");
          setAudioButtonState(button, true);
        });

        audio.addEventListener("ended", () => {
          const button = audio.closest("[data-panel]")?.querySelector("[data-panel-audio-toggle]");
          setAudioButtonState(button, false);
        });

        audio.addEventListener("pause", () => {
          const button = audio.closest("[data-panel]")?.querySelector("[data-panel-audio-toggle]");

          if (audio.currentTime < audio.duration || Number.isNaN(audio.duration)) {
            setAudioButtonState(button, false);
          }
        });
      });
    };

    const withViewTransition = (callback) => {
      if (document.startViewTransition) {
        document.startViewTransition(callback);
        return;
      }

      callback();
    };

    const wrapIndex = (index) => {
      return ((index % panels.length) + panels.length) % panels.length;
    };

    const getPanel = (index) => {
      return panels[wrapIndex(index)];
    };

    const syncNavigation = (scope, index) => {
      scope.querySelectorAll("[data-panel-target]").forEach((button) => {
        const isActive = Number(button.getAttribute("data-panel-target")) === index;
        button.setAttribute("aria-pressed", String(isActive));
      });
    };

    const resetAudio = (scope) => {
      scope.querySelectorAll("audio").forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;
      });

      scope.querySelectorAll("[data-panel-audio-toggle]").forEach((button) => {
        setAudioButtonState(button, false);
      });
    };

    const renderStage = (index) => {
      activeIndex = wrapIndex(index);

      panels.forEach((panel, panelIndex) => {
        const isActive = panelIndex === activeIndex;
        panel.hidden = !isActive;
        panel.setAttribute("data-active", String(isActive));
        syncNavigation(panel, activeIndex);

        if (!isActive) {
          resetAudio(panel);
        }
      });
    };

    const renderViewer = () => {
      if (!viewerContent) {
        return;
      }

      const clone = getPanel(activeIndex).cloneNode(true);
      clone.hidden = false;
      clone.setAttribute("data-active", "true");
      syncNavigation(clone, activeIndex);
      resetAudio(clone);
      bindAudioScope(clone);
      viewerContent.replaceChildren(clone);
    };

    const openViewer = () => {
      if (!viewer || !viewerContent || viewer.open) {
        return;
      }

      renderViewer();

      withViewTransition(() => {
        viewer.showModal();
        html.setAttribute("data-panel-viewer-open", "true");
      });
    };

    const closeViewer = () => {
      if (!viewer?.open) {
        return;
      }

      withViewTransition(() => {
        viewer.close();
        html.removeAttribute("data-panel-viewer-open");
      });
    };

    const wait = (duration) => {
      return new Promise((resolve) => {
        window.setTimeout(resolve, duration);
      });
    };

    const updateIndex = async (index) => {
      const nextIndex = wrapIndex(index);

      if (isTransitioning || nextIndex === activeIndex) {
        if (viewer?.open) {
          renderViewer();
        }
        return;
      }

      isTransitioning = true;
      panelRoot.classList.add("is-transitioning");
      await wait(panelFadeDuration);
      renderStage(nextIndex);

      if (viewer?.open) {
        renderViewer();
      }

      requestAnimationFrame(() => {
        panelRoot.classList.remove("is-transitioning");
        window.setTimeout(() => {
          isTransitioning = false;
        }, panelFadeDuration);
      });
    };

    const toggleAudio = (button) => {
      const panel = button.closest("[data-panel]");
      const audio = panel?.querySelector("audio");

      if (!audio) {
        return;
      }

      if (audio.paused) {
        resetAllAudio();
        setAudioButtonState(button, true);
        audio.play().catch(() => {
          setAudioButtonState(button, false);
        });
        return;
      }

      audio.pause();
      setAudioButtonState(button, false);
    };

    const handlePanelAction = (button) => {
      if (button.hasAttribute("data-panel-target")) {
        updateIndex(Number(button.getAttribute("data-panel-target")));
        return;
      }

      if (button.hasAttribute("data-panel-step")) {
        updateIndex(activeIndex + Number(button.getAttribute("data-panel-step")));
        return;
      }

      if (button.hasAttribute("data-panel-expand")) {
        openViewer();
        return;
      }

      if (button.hasAttribute("data-panel-close")) {
        closeViewer();
        return;
      }

      if (button.hasAttribute("data-panel-audio-toggle")) {
        toggleAudio(button);
      }
    };

    document.addEventListener("click", (event) => {
      const button = event.target.closest("[data-panel-target], [data-panel-step], [data-panel-expand], [data-panel-close], [data-panel-audio-toggle]");

      if (!button) {
        return;
      }

      if (!button.closest("#panels") && !button.closest("[data-panel-viewer]")) {
        return;
      }

      handlePanelAction(button);
    });

    viewer?.addEventListener("cancel", () => {
      html.removeAttribute("data-panel-viewer-open");
    });

    viewer?.addEventListener("close", () => {
      html.removeAttribute("data-panel-viewer-open");
    });

    panels.forEach((panel) => {
      bindAudioScope(panel);
    });

    renderStage(activeIndex);
  }
}
