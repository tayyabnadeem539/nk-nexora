import { useCallback, useRef } from 'react';

const MOUSE_YAW_RANGE = 42;
const MOUSE_PITCH_RANGE = 20;
const DRAG_YAW_SPEED = 0.85;
const DRAG_PITCH_SPEED = 0.35;
const PITCH_MIN = -24;
const PITCH_MAX = 30;

/**
 * Look-around camera for the 3D theater.
 * - Mouse hover tilts the view toward the pointer
 * - Drag rotates freely (full 360°) — after the first drag, hover stops steering
 * - Double-click / recenter() snaps back to the screen
 * Writes --fv-camera-yaw / --fv-camera-pitch on the room element.
 */
export default function useTheatreCamera(roomRef) {
  const cam = useRef({ yaw: 0, pitch: 0, dragging: false, turned: false, lastX: 0, lastY: 0 });

  const apply = useCallback(() => {
    const room = roomRef.current;
    if (!room) return;
    room.style.setProperty('--fv-camera-yaw', `${(-cam.current.yaw).toFixed(2)}deg`);
    room.style.setProperty('--fv-camera-pitch', `${cam.current.pitch.toFixed(2)}deg`);
  }, [roomRef]);

  const recenter = useCallback(() => {
    Object.assign(cam.current, { yaw: 0, pitch: 0, turned: false });
    apply();
  }, [apply]);

  const onPointerDown = (e) => {
    if (e.target.closest('.fv-theatre-screen')) return;
    Object.assign(cam.current, { dragging: true, turned: true, lastX: e.clientX, lastY: e.clientY });
    e.currentTarget.classList.add('is-dragging');
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    const c = cam.current;
    if (c.dragging) {
      c.yaw += (e.clientX - c.lastX) * DRAG_YAW_SPEED;
      c.pitch = Math.max(PITCH_MIN, Math.min(PITCH_MAX, c.pitch - (e.clientY - c.lastY) * DRAG_PITCH_SPEED));
      c.lastX = e.clientX;
      c.lastY = e.clientY;
      apply();
    } else if (!c.turned && e.pointerType === 'mouse') {
      const box = e.currentTarget.getBoundingClientRect();
      if (!box.width || !box.height) return;
      c.yaw = ((e.clientX - box.left) / box.width - 0.5) * 2 * MOUSE_YAW_RANGE;
      c.pitch = -((e.clientY - box.top) / box.height - 0.5) * 2 * MOUSE_PITCH_RANGE;
      apply();
    }
  };

  const endDrag = (e) => {
    cam.current.dragging = false;
    e.currentTarget.classList.remove('is-dragging');
  };

  const onPointerLeave = () => {
    const c = cam.current;
    if (!c.turned && !c.dragging) {
      c.yaw = 0;
      c.pitch = 0;
      apply();
    }
  };

  const sceneHandlers = {
    onPointerDown,
    onPointerMove,
    onPointerUp: endDrag,
    onPointerCancel: endDrag,
    onPointerLeave,
    onDoubleClick: recenter
  };

  return { sceneHandlers, recenter };
}
