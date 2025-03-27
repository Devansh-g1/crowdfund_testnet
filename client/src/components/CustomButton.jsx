import React from 'react'

const CustomButton = ({ btnType, title, handleClick, styles }) => {
  return (
    <button
      type={btnType}
      className={`font-epilogue font-semibold text-[16px] leading-[26px] text-background bg-primary hover:bg-primary-400 transition-colors duration-200 min-h-[52px] pl-4 pr-4 px-4 rounded-[10px] shadow-md ${styles}`}
      onClick={handleClick}
    >
      {title}
    </button>
  )
}

export default CustomButton
