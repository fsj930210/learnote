import styles from './index.module.scss';
import { devDependencies } from '../../../package.json';

const Header = () => {
  return (
    <div className={styles.header}>
      this is a header
      <div className="p-20px text-center">
        <h1 className="font-bold text-2xl mb-2">vite version: {devDependencies.vite}</h1>
      </div>
      <div className="flex-c">99999</div>
    </div>
  );
};

export default Header;
