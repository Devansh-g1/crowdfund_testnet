import React from 'react'

const FormField = ({ labelName, placeholder, inputType, isTextArea, value, handleChange }) => {
  return (
    <div className="flex flex-col space-y-2">
      {labelName && (
        <label className="text-text-300 font-medium text-sm">
          {labelName}
        </label>
      )}
      {isTextArea ? (
        <textarea 
          required
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          rows={4}
          className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-text-700 bg-secondary bg-opacity-30 focus:ring-2 focus:ring-accent-400 font-epilogue text-text-100 text-[14px] placeholder:text-text-600 rounded-[10px] sm:min-w-[300px] transition-shadow"
        />
      ) : (
        <input 
          required
          value={value}
          onChange={handleChange}
          type={inputType}
          step="0.1"
          placeholder={placeholder}
          className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-text-700 bg-secondary bg-opacity-30 focus:ring-2 focus:ring-accent-400 font-epilogue text-text-100 text-[14px] placeholder:text-text-600 rounded-[10px] sm:min-w-[300px] transition-shadow"
        />
      )}
    </div>
  )
}

export default FormField;