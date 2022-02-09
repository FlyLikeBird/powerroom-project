import { connect } from 'dva';
import { Link } from 'umi';
import style from './index.less';
import Header from './components/Header';
function IndexPage({ children, global }) {
   
    return (
        <div className={style['container']}>
            <Header />
            {
                global.userAuthed
                ?
                <div className={style['main-content']}>
                    { children }
                </div>
                :
                null 
            }  
        </div>
        
    );
}

export default connect(({ global })=>({ global }))(IndexPage);
