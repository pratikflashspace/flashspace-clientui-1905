"use client";
import { cn } from "@/lib/utils";
import { AnimationOptions, useAnimate } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

export interface Splash3dButtonProps {
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Splash3dButton = ({
  className,
  children,
  onClick,
  disabled,
}: Splash3dButtonProps) => {
  const { isActive, handlePress } = usePress();
  const [scope, animate] = useAnimate();
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);

  useEffect(() => {
    // @ts-expect-error for safari
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContextRef.current = new AudioContext();

    fetch("/assets/click.mp3")
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) =>
        audioContextRef.current!.decodeAudioData(arrayBuffer),
      )
      .then((decodedAudio) => {
        audioBufferRef.current = decodedAudio;
      })
      .catch((err) => {
        // console.error("Error loading audio", err);
      });
  }, []);

  function playAudio() {
    if (!audioContextRef.current || !audioBufferRef.current) return;

    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBufferRef.current;

    const gainNode = audioContextRef.current.createGain();
    gainNode.gain.value = 0.8;

    source.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);
    source.start();
  }

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    playAudio();
    handlePress();
    animation(e);
    if (onClick) onClick(e);
  }

  function createEle(x: string, y: string) {
    const ele = document.createElement("div");
    ele.className = cn("absolute rounded-full bg-black dark:bg-white");

    const size = random(15, 25);

    Object.assign(ele.style, {
      height: `${size}px`,
      width: `${size}px`,
      left: x,
      top: y,
      transform: "translate(-50%, -50%)",
    });

    return ele;
  }

  async function animation(e: React.MouseEvent<HTMLButtonElement>) {
    if (!scope.current) return;
    const t: AnimationOptions = { duration: 0.4, ease: "easeOut" };
    const wrapper = scope.current.querySelector("#splash-wrapper");

    const numElements = Math.floor(Math.random() * 5) + 5; // 5 to 10
    const elements: HTMLElement[] = [];

    const bounding = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX ? `${e.clientX - bounding.left}px` : "50%";
    const clickY = e.clientY ? `${e.clientY - bounding.top}px` : "50%";

    for (let i = 0; i < numElements; i++) {
      const ele = createEle(clickX, clickY);
      wrapper.appendChild(ele);
      elements.push(ele);
    }

    await Promise.all(
      elements.map((e) => {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 50 + 50; // 50 to 100

        const xOffset = Math.cos(angle) * distance;
        const yOffset = Math.sin(angle) * distance;

        return animate(e, { x: xOffset, y: yOffset, scale: 0 }, t);
      }),
    );

    elements.forEach((ele) => ele.remove());
  }

  return (
    <button
      ref={scope}
      disabled={disabled}
      className={cn(
        "group relative cursor-pointer",
        "disabled:pointer-events-none",
      )}
      onClick={handleClick}
      aria-label="3D Splash Button"
    >
      <span id="splash-wrapper" className="absolute inset-0" />
      {/* Bottom shadow layer for 3D depth */}
      <span
        className={cn(
          "absolute inset-0 translate-y-[3px] rounded-lg",
          "bg-gradient-to-b from-black/20 to-black/30 blur-[1px]",
          isActive && "translate-y-[1px] opacity-60",
        )}
      ></span>
      {/* Main button surface */}
      <span
        className={cn(
          "relative flex items-center justify-center gap-2 rounded-lg will-change-transform select-none",
          "transition-all duration-150 ease-out",
          "group-hover:translate-y-[-1px] group-hover:shadow-[0_3px_8px_rgba(0,0,0,0.15),0_1px_3px_rgba(0,0,0,0.1),inset_0_-1px_2px_rgba(0,0,0,0.1)]",
          "shadow-[0_2px_5px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.08),inset_0_-2px_4px_rgba(0,0,0,0.08)]",
          isActive && "translate-y-[2px]! shadow-[0_1px_2px_rgba(0,0,0,0.15),inset_0_1px_3px_rgba(0,0,0,0.2)]! [transition-duration:34ms]!",
          className,
        )}
      >
        {children}
      </span>
    </button>
  );
};

export default Splash3dButton;

const usePress = (duration = 34, debounceTime = 34) => {
  const [isActive, setIsActive] = useState(false);
  const lastPressTime = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  const handlePress = useCallback(() => {
    const now = Date.now();
    if (now - lastPressTime.current < debounceTime) return;

    lastPressTime.current = now;
    setIsActive(true);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsActive(false);
    }, duration);
  }, [duration, debounceTime]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return {
    isActive,
    handlePress,
  };
};

function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
