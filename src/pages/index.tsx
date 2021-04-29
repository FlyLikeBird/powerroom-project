import styles from './index.less';
import { Link } from 'umi';
import style from './index.less';
import Header from './components/Header';
function IndexPage({ children }) {
    return (
        <div className={style['container']}>
            <Header />
            <div className={style['main-content']}>
                { children }
            </div>
        </div>
        
    );
}

export default IndexPage;
