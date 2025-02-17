import { useState, useEffect } from "react";

export default function useDraggable(el: any) {
  const [{ dx, dy }, setOffset] = useState({ dx: 0, dy: 0 });

  useEffect(() => {
    const handleMouseDown = (event: { pageX: number; pageY: number; }) => {
      const startX = event.pageX - dx;
      const startY = event.pageY - dy;

      const handleMouseMove = (event: { pageX: number; pageY: number; }) => {
        const newDx = event.pageX - startX;
        const newDy = event.pageY - startY;
        setOffset({ dx: newDx, dy: newDy });
      };

      document.addEventListener("mousemove", handleMouseMove);

      document.addEventListener(
        "mouseup",
        () => {
          document.removeEventListener("mousemove", handleMouseMove);
        },
        { once: true }
      );
    };

    el.current.addEventListener("mousedown", handleMouseDown);

    return () => {
      el.current.removeEventListener("mousedown", handleMouseDown);
    };
  }, [dx, dy]);

  useEffect(() => {
    el.current.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
  }, [dx, dy]);
}
