import { dynamic } from 'umi';

export default dynamic({
    loader:async function(){
        const { default:RunningReport } = await import('./RunningReport');
        return RunningReport;
    }
})
