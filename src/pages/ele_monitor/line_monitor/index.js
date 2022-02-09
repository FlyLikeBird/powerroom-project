import { dynamic } from 'umi';

export default dynamic({
    loader:async function(){
        const { default:LineMonitor } = await import('./LineMonitor');
        return LineMonitor;
    }
})
