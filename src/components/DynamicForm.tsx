import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "./Button.styled";
import dummyData from "../data/data.json";
// import axios from 'axios';

interface Field {
  field_type: string;
  location: number[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
  options?: string[];
  func_name?: string;
}

interface FormSchema {
  [pageKey: string]: {
    [sectionKey: string]: {
      [fieldKey: string]: Field;
    };
  };
}

const DynamicForm = () => {
  const { control, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [formSchema, setFormSchema] = useState<FormSchema>(dummyData);

  useEffect(() => {
    // axios.get('https://???')
    //   .then(response => setFormSchema(response.data))
    //   .catch(error => console.error('Error fetching form schema:', error));

    setFormSchema(dummyData);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (formData: Record<string, any>) => {
    setLoading(true);
    const output = structuredClone(formSchema);

    for (const [pageKey, sections] of Object.entries(output)) {
      for (const [sectionKey, fields] of Object.entries(sections)) {
        for (const [fieldKey, field] of Object.entries(fields)) {
          const rawValue = formData?.[pageKey]?.[sectionKey]?.[fieldKey];

          let transformedValue = rawValue;

          if (field.field_type === "search_listbox") {
            transformedValue = rawValue?.value || "";
          } else if (field.field_type === "boolean_checkbox") {
            transformedValue = rawValue ? "yes" : "no";
          } else if (field.field_type === "date_parts") {
            if (rawValue instanceof Date && !isNaN(rawValue.getTime())) {
              const year = rawValue.getFullYear();
              const month = String(rawValue.getMonth() + 1).padStart(2, "0");
              const day = String(rawValue.getDate()).padStart(2, "0");
              transformedValue = `${year}-${month}-${day}`; // "YYYY-MM-DD"
            } else {
              transformedValue = "";
            }
          }

          // Save using the correct structure
          if (transformedValue !== undefined) {
            if (["boolean_checkbox", "date_parts"].includes(field.field_type)) {
              field.value = { val: transformedValue };
            } else {
              field.value = transformedValue;
            }
          }
        }
      }
    }

    console.log("Recreated schema:", output);
    // try {
    //   const response = await axios.post('https://your-backend-endpoint.com/generate-pdf', data, {
    //     responseType: 'blob',
    //   });
    //   // Handle the PDF blob response
    // } catch (error) {
    //   console.error('Error generating PDF:', error);
    // }
  };

  const renderField = (name: string, field: Field) => {
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
              <input
                style={{ color: "rgb(51, 51, 51)" }}
                {...controllerField}
              />
            )}
          />
        );
      case "search_listbox":
        return (
          <Controller
            name={name}
            control={control}
            defaultValue={selectedOption}
            render={({ field: controllerField }) => (
              <Select
                {...controllerField}
                options={selectOptions}
                value={controllerField.value}
                onChange={(val) => controllerField.onChange(val)}
                menuPortalTarget={document.body}
                styles={{
                  control: (base) => ({
                    ...base,
                    width: "300px",
                  }),
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
                style={{ width: "20px", height: "20px" }}
                type="checkbox"
                {...controllerField}
                checked={controllerField.value}
              />
            )}
          />
        );
      case "date_parts":
        return (
          <Controller
            name={name}
            control={control}
            defaultValue={field.value?.val ? new Date(field.value.val) : null}
            render={({ field: controllerField }) => (
              <DatePicker
                selected={controllerField.value}
                onChange={controllerField.onChange}
                popperClassName="datepicker-popper"
                portalId="root-portal"
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
                    style={{ width: 80, color: "rgb(51, 51, 51)" }}
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
                    style={{ width: 150, color: "rgb(51, 51, 51)" }}
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
            <h2>{sectionKey.replace(/_/g, " ").toUpperCase()}</h2>
            {Object.entries(fields)
              .filter(
                ([fieldKey]) => fieldKey !== "validate" && fieldKey !== "ok"
              )
              .map(([fieldKey, field]: [string, Field]) => (
                <div className="form-group" key={fieldKey}>
                  <label
                    className={
                      field.field_type === "boolean_checkbox"
                        ? "checkbox-label"
                        : ""
                    }
                  >
                    {fieldKey.replace(/_/g, " ")}
                  </label>
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
