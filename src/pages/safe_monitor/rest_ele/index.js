import { dynamic } from 'umi';

export default dynamic({
    loader:async function(){
        const { default:RestEleManager } = await import('./RestEleManager');
        return RestEleManager;
    }
})
