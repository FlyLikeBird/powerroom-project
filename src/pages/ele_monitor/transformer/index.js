import { dynamic } from 'umi';

export default dynamic({
    loader:async function(){
        const { default:Transformer } = await import('./Transformer');
        return Transformer;
    }
})
