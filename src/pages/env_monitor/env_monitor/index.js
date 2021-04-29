import { dynamic } from 'umi';

export default dynamic({
    loader:async function(){
        const { default:EnvMonitor } = await import('./EnvMonitor');
        return EnvMonitor;
    }
})
