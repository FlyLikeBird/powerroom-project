import { dynamic } from 'umi';

export default dynamic({
    loader:async function(){
        const { default:AdjustCostManager } = await import('./AdjustCostManager');
        return AdjustCostManager;
    }
})
