import Image from 'next/image';
import DashboardIcon from '../../public/images/dashboard-icon.png';

const DashboardConfigButton = () => {
  return (
    <div>
      <Image src={DashboardIcon} height={128} width={176} alt='Dashboard Icon' />
    </div>
  )
}

export default DashboardConfigButton
