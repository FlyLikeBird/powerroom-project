import { dynamic } from 'umi';

export default dynamic({
    loader:async function(){
        const { default:CostReportManager } = await import('./CostReportManager');
        return CostReportManager;
    }
})
