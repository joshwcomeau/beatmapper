/**
 * A common pattern in this application is this:
 * - The user clicks and holds the left click button and moves the mouse, to
 *   start a new tentative action
 * - At some point later, the user will release the mouse, and commit the
 *   result of that action
 *
 * Some examples of this:
 * - When placing a new block in the notes view, you can drag the mouse in
 *   different directions to change what direction it faces
 * - When placing a new event in the SpeedTrack component, you can click and
 *   drag to change the speed of the tentative event
 *
 * The problem with this, in a React hooks world, is that data becomes stale.
 *
 * I want to register a GLOBAL event listener on mouseup (they might move the
 * mouse off of the target DOM node and I still want to capture that). But if
 * I register that global listener in the render method, it will be a closure
 * for that specific render call; as the user moves the mouse around, it
 * changes React state, which prompts a re-render, which means we've closed
 * over stale values and no longer have access to the current state.
 *
 * This is a really friggin complicated problem to describe, I'm sorry if this
 * description isn't helpful :(
 *
 * A good resource for understanding this problem is Dan Abramov's blog post
 * about `setInterval`. While the solution isn't exactly the same, it's the
 * same underlying problem / mismatch:
 * https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 *
 * This solution works by storing a ref to the callback, and then
 * re-registering the listener whenever it changes.
 *
 * Additionally, I don't necessarily want to fire on EVERY pointer-up.
 * Usually it only "counts" when the user starts clicking on a specific node.
 * So the first argument to this hook is whether or not we're currently in
 * a state where we want to fire the callback upon pointerup.
 */
import React from 'react';

const usePointerUpHandler = (shouldFire, callback) => {
  const savedCallback = React.useRef(callback);

  React.useEffect(() => {
    if (shouldFire) {
      window.addEventListener('pointerup', callback);
    }

    savedCallback.current = callback;

    return () => {
      window.removeEventListener('pointerup', callback);
    };
  }, [shouldFire, callback]);
};

export default usePointerUpHandler;
