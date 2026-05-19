import { CosmosScene } from './components/CosmosScene';
import { UIOverlay } from './components/UIOverlay';

export default function App() {
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#030712] text-slate-200 font-sans selection:bg-cyan-500/30">
      <CosmosScene />
      <UIOverlay />
    </main>
  );
}
