import BookIcon from './icons/BookIcon';
import CalenderIcon from './icons/CalenderIcon';
import ChartIcon from './icons/ChartIcon';
import HeartIcon from './icons/HeartIcon';
import SettingIcon from './icons/SettingIcon';

export default function IconRenderer({ icon }: { icon: string }) {
  switch (icon) {
    case 'calender':
      return <CalenderIcon />;
    case 'diary':
      return <BookIcon />;
    case 'chart':
      return <ChartIcon />;
    case 'heart':
      return <HeartIcon />;
    case 'setting':
      return <SettingIcon />;
    default:
      return <CalenderIcon />;
  }
}
