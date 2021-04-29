import { dynamic } from 'umi';

export default dynamic({
    loader:async function(){
        const { default:EleMonitor } = await import('./EleMonitor');
        return EleMonitor;
    }
})
