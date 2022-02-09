import { dynamic } from 'umi';

export default dynamic({
    loader:async function(){
        const { default:CostTrendManager } = await import('./CostTrendManager');
        return CostTrendManager;
    }
})
