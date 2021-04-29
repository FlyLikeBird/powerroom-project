import { dynamic } from 'umi';

export default dynamic({
    loader:async function(){
        const { default:UserSetting } = await import('./UserSetting');
        return UserSetting;
    }
})
