import { connect } from 'dva';
import { Link } from 'umi';
import style from './index.less';
import Header from './components/Header';
function IndexPage({ children, global }) {
    let { userAuthed, isFrame } = global;
    return (
        <div className={style['container']}>
            { 
                userAuthed 
                ?
                isFrame 
                ?
                null
                :
                <Header />
                :
                null
            }
            {
                userAuthed
                ?
                <div className={style['main-content']} style={{ height:isFrame ? '100%' : 'calc( 100% - 60px)'}}>
                    { children }
                </div>
                :
                null 
            }  
        </div>
        
    );
}

export default connect(({ global })=>({ global }))(IndexPage);
