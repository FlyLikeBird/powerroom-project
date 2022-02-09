import { dynamic } from 'umi';

export default dynamic({
    loader:async function(){
        const { default:BaseCostManager } = await import('./BaseCostManager');
        return BaseCostManager;
    }
})
