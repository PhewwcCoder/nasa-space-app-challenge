import { createContext, useContext, useEffect, useRef, type ComponentProps, type ComponentRef, type ReactNode } from 'react';
import { useFrame, type RenderCallback, type RootState } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const Activity = createContext(true);
const ControlsRoot = createContext<Pick<RootState, 'get' | 'set'> | null>(null);
export const useSceneActive = () => useContext(Activity);
export function SceneActivity({ active, root, children }: { active: boolean; root: Pick<RootState, 'get' | 'set'>; children: ReactNode }) {
  return <ControlsRoot.Provider value={root}><Activity.Provider value={active}>{children}</Activity.Provider></ControlsRoot.Provider>;
}
/** Keep the existing shared inspector API pointed at the actual active controls. */
export function SceneOrbitControls(props: ComponentProps<typeof OrbitControls>) {
  const ref = useRef<ComponentRef<typeof OrbitControls>>(null);
  const root = useContext(ControlsRoot)!;
  const { get, set } = root;
  useEffect(() => {
    const controls = ref.current;
    set({ controls });
    return () => { if (get().controls === controls) set({ controls: null }); };
  }, [get, set]);
  return <OrbitControls {...props} ref={ref}/>;
}
/** Retained worlds own resources, but only the visible world may advance its simulation. */
export function useSceneFrame(callback: RenderCallback) {
  const active = useSceneActive();
  useFrame((state, delta, frame) => { if (active) callback(state, delta, frame); });
}
