import React, { useRef, useEffect } from "react";

interface Dot {
  x: number;
  y: number;
  ox: number;
  oy: number;
  size: number;
  angle: number;
}

const CanvasAnimation: React.FC<{
  height: string;
  width: string;
  background: string;
  fillColor: string;
}> = ({ background, height, width, fillColor }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const dots: Dot[] = [];
  const wide = 40;
  const high = wide / 2;
  const padding = 0;

  useEffect(() => {
    const stage = canvasRef.current;
    const ctx: any = stage?.getContext("2d");
    const ratio = window.devicePixelRatio || 1;
    let cb = stage?.getBoundingClientRect();

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.pageX * ratio;
      mouse.current.y = e.pageY * ratio;
    };

    const handleResize = () => {
      ctx!.canvas.width = window.innerWidth * ratio;
      ctx!.canvas.height = window.innerHeight * ratio;
      cb = stage?.getBoundingClientRect();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);
    handleResize();

    function create() {
      for (let i = -1; ++i < wide; ) {
        const x =
          Math.floor(((cb!.width - padding * 2) / (wide - 1)) * i + padding) *
          ratio;

        for (let j = -1; ++j < high; ) {
          const y =
            Math.floor(
              ((cb!.height - padding * 2) / (high - 1)) * j + padding
            ) * ratio;

          dots.push({
            x: x,
            y: y,
            ox: x,
            oy: y,
            size: 0,
            angle: 0,
          });
        }
      }
    }

    function render() {
      if (!ctx) return;

      // clear the canvas
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      // choose the dot color
      ctx.fillStyle = getComputedStyle(
        document.documentElement
      ).getPropertyValue(fillColor);

      // for each line
      for (let i = 0; i < dots.length; i++) {
        const s = dots[i];

        const v = getV(s);

        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x + v.x, s.y + v.y);
        ctx.strokeStyle = getComputedStyle(
          document.documentElement
        ).getPropertyValue(fillColor);
        ctx.lineWidth = 1 * ratio;
        ctx.stroke();
        ctx.closePath();
      }

      // for each dot
      for (let i = 0; i < dots.length; i++) {
        const s = dots[i];

        const v = getV(s);

        ctx.circle(s.x + v.x, s.y + v.y, s.size * ratio);
        ctx.fill();
      }
    }

    function getV(dot: Dot) {
      // find the distance from the line to the mouse
      const d = getDistance(dot, mouse.current);

      // reverse the distance, so that the number is bigger when the mouse is closer.
      dot.size = (200 - d) / 20;
      dot.size = dot.size < 1 ? 1 : dot.size;

      dot.angle = getAngle(dot, mouse.current);

      return {
        x: (d > 20 ? 20 : d) * Math.cos((dot.angle * Math.PI) / 180),
        y: (d > 20 ? 20 : d) * Math.sin((dot.angle * Math.PI) / 180),
      };
    }

    function getAngle(
      obj1: { x: number; y: number },
      obj2: { x: number; y: number }
    ) {
      const dX = obj2.x - obj1.x;
      const dY = obj2.y - obj1.y;
      const angleDeg = (Math.atan2(dY, dX) / Math.PI) * 180;
      return angleDeg;
    }

    function getDistance(
      obj1: { x: number; y: number },
      obj2: { x: number; y: number }
    ) {
      const dx = obj1.x - obj2.x;
      const dy = obj1.y - obj2.y;
      return Math.sqrt(dx * dx + dy * dy);
    }

    (CanvasRenderingContext2D as any).prototype.circle = function (
      x: number,
      y: number,
      r: number
    ) {
      this.beginPath();
      this.arc(x, y, r, 0, 2 * Math.PI, false);
      this.closePath();
    };

    (window as any).requestAnimFrame = (() => {
      return (
        window.requestAnimationFrame ||
        function (callback: any) {
          window.setTimeout(callback, 1000 / 60);
        }
      );
    })();

    (function animloop() {
      render();
      requestAnimationFrame(animloop);
    })();

    create();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ background: `var(${background})`, width: width, height: height }}
    />
  );
};

export default CanvasAnimation;
