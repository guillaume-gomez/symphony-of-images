interface Option {
  value: any;
  label: string
}
interface SelectProps {
  label: string;
  value: any;
  onChange: (value: any) => void;
  options: Option[];
}

function Select({ label, value, onChange, options } : SelectProps) {
  return (
    <div className="form-control">
      <label className="label cursor-pointer">{label}</label>
      <select
        onChange={(e) =>onChange(e.target.value)}
        value={value}
        className="select select-primary rounded-md"
      >
        <option className="bg-neutral" disabled>{label}</option>
        {
            options.map(({value, label}) => <option value={value}>{label}</option> )
        }
      </select>
    </div>
  );
}

export default Select;