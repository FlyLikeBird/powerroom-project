import { dynamic } from 'umi';

export default dynamic({
    loader:async function(){
        const { default:MeasureCostManager } = await import('./MeasureCostManager');
        return MeasureCostManager;
    }
})
