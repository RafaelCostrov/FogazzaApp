import Checkbox from '@mui/material/Checkbox';
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { IoCheckbox } from "react-icons/io5";

export default function IconCheck({ checked, onChange, title }) {
  return (
    <Checkbox
      checked={checked}
      onChange={onChange}
      icon={<MdCheckBoxOutlineBlank style={{ color: '#777676', width: '24px', height: '24px' }} />} 
      checkedIcon={<IoCheckbox style={{ color: '#D1A24B', width: '24px', height: '24px' }} />}
      inputProps={{ 'aria-label': title || 'checkbox' }}
      sx={{
        '&.Mui-checked': {
          color: '#D1A24B',
        },
      }}
    />
  );
}
