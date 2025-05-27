import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button } from './Button.styled';
import dummyData from '../data/data.json';
// import axios from 'axios';


const DynamicForm = () => {
  const { control, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [formSchema, setFormSchema] = useState(dummyData)

  useEffect(() => {
    // axios.get('https://???')
    //   .then(response => setFormSchema(response.data))
    //   .catch(error => console.error('Error fetching form schema:', error));
    
    setFormSchema(dummyData);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    setLoading(true);
    console.log('Form Data:', data);
    // try {
    //   const response = await axios.post('https://your-backend-endpoint.com/generate-pdf', data, {
    //     responseType: 'blob',
    //   });
    //   // Handle the PDF blob response
    // } catch (error) {
    //   console.error('Error generating PDF:', error);
    // }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderField = (name: string, field: any) => {
    switch (field.field_type) {
      case 'str':
        return (
          <Controller
            name={name}
            control={control}
            defaultValue={field.value || ''}
            render={({ field }) => <input {...field} />}
          />
        );
      case 'search_listbox':
        return (
          <Controller
            name={name}
            control={control}
            defaultValue={field.value || ''}
            render={({ field }) => (
              <Select
                {...field}
                options={[{ label: field.value, value: field.value }]} // Replace with actual options
              />
            )}
          />
        );
      case 'boolean_checkbox':
        return (
          <Controller
            name={name}
            control={control}
            defaultValue={field.value?.val === 'yes'}
            render={({ field }) => (
              <input type="checkbox" {...field} checked={field.value} />
            )}
          />
        );
      case 'date_parts':
        return (
          <Controller
            name={name}
            control={control}
            defaultValue={new Date(field.value?.val)}
            render={({ field }) => (
              <DatePicker selected={field.value} onChange={field.onChange} />
            )}
          />
        );
      // Add more cases as needed
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {Object.entries(formSchema).map(([pageKey, sections]) =>
        Object.entries(sections).map(([sectionKey, fields]) => (
          <div key={sectionKey}>
            <h2>{sectionKey.replace(/_/g, ' ')}</h2>
            {Object.entries(fields).map(([fieldKey, field]) => (
              <div key={fieldKey}>
                <label>{fieldKey.replace(/_/g, ' ')}</label>
                {renderField(`${pageKey}.${sectionKey}.${fieldKey}`, field)}
              </div>
            ))}
          </div>
        ))
      )}
      <Button background="green" disabled={loading} type="submit">{loading ? 'Generating...' : 'Generate Form'}</Button>
    </form>
  );
};

export default DynamicForm;
