import { dynamic } from 'umi';

export default dynamic({
    loader:async function(){
        const { default:RoleManager } = await import('./RoleManager');
        return RoleManager;
    }
})
