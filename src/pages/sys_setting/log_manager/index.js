import { dynamic } from 'umi';

export default dynamic({
    loader:async function(){
        const { default:LogManager } = await import('./LogManager');
        return LogManager;
    }
})
