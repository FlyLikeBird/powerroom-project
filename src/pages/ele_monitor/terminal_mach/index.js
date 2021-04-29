import { dynamic } from 'umi';

export default dynamic({
    loader:async function(){
        const { default:TerminalMach } = await import('./TerminalMach');
        return TerminalMach;
    }
})
