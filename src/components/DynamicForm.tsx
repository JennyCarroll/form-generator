import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "./Button.styled";
import dummyData from "../data/data.json";
// import axios from 'axios';

const DynamicForm = () => {
  const { control, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [formSchema, setFormSchema] = useState(dummyData);

  useEffect(() => {
    // axios.get('https://???')
    //   .then(response => setFormSchema(response.data))
    //   .catch(error => console.error('Error fetching form schema:', error));

    setFormSchema(dummyData);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    setLoading(true);
    console.log("Form Data:", data);
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
    const selectOptions =
      Array.isArray(field.options) && field.options.length > 0
        ? field.options.map((opt: string) => ({
            label: opt,
            value: opt,
          }))
        : [
            {
              label: field.value,
              value: field.value,
            },
          ];

    const selectedOption =
      selectOptions.find(
        (opt: { label: string; value: string }) => opt.value === field.value
      ) || undefined;

    switch (field.field_type) {
      case "str":
        return (
          <Controller
            name={name}
            control={control}
            defaultValue={field.value || ""}
            render={({ field: controllerField }) => (
              <input {...controllerField} />
            )}
          />
        );
      case "search_listbox":
        return (
          <Controller
            name={name}
            control={control}
            defaultValue={field.value || undefined}
            render={({ field: controllerField }) => (
              <Select
                {...controllerField}
                options={selectOptions}
                value={selectedOption || ""}
                onChange={(val) => controllerField.onChange(val)}
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 2147483647 }),
                }}
              />
            )}
          />
        );
      case "boolean_checkbox":
        return (
          <Controller
            name={name}
            control={control}
            defaultValue={field.value?.val === "yes"}
            render={({ field: controllerField }) => (
              <input
                type="checkbox"
                {...controllerField}
                checked={!!field.value}
              />
            )}
          />
        );
      case "date_parts":
        return (
          <Controller
            name={name}
            control={control}
            defaultValue={new Date(field.value?.val)}
            render={({ field: controllerField }) => (
              <DatePicker
                selected={controllerField.value}
                onChange={controllerField.onChange}
              />
            )}
          />
        );
      case "func":
        if (field.func_name === "phone_parts") {
          const val = field.value || {};
          return (
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <Controller
                name={`${name}.country_code`}
                control={control}
                defaultValue={val.country_code || ""}
                render={({ field: controllerField }) => (
                  <input
                    {...controllerField}
                    placeholder="Country Code"
                    style={{ width: 80 }}
                  />
                )}
              />
              <Controller
                name={`${name}.number`}
                control={control}
                defaultValue={val.number || ""}
                render={({ field: controllerField }) => (
                  <input
                    {...controllerField}
                    placeholder="Phone Number"
                    style={{ width: 150 }}
                  />
                )}
              />
            </div>
          );
        }
        return null;

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {Object.entries(formSchema).map(([pageKey, sections]) =>
        Object.entries(sections).map(([sectionKey, fields]) => (
          <div key={sectionKey}>
            <h2>{sectionKey.replace(/_/g, " ")}</h2>
            {Object.entries(fields)
              .filter(
                ([fieldKey]) => fieldKey !== "validate" && fieldKey !== "ok"
              )
              .map(([fieldKey, field]) => (
                <div className="form-group" key={fieldKey}>
                  <label>{fieldKey.replace(/_/g, " ")}</label>
                  {renderField(`${pageKey}.${sectionKey}.${fieldKey}`, field)}
                </div>
              ))}
          </div>
        ))
      )}
      <Button background="purple" disabled={loading} type="submit">
        {loading ? "Generating..." : "Generate Form"}
      </Button>
    </form>
  );
};

export default DynamicForm;
