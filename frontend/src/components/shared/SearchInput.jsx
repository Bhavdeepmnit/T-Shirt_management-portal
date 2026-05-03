import { HiOutlineSearch } from 'react-icons/hi';

const SearchInput = ({ value, onChange, placeholder = 'Search...' }) => {
  return (
    <div className="relative">
      <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 w-5 h-5" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-field pl-10"
      />
    </div>
  );
};

export default SearchInput;
