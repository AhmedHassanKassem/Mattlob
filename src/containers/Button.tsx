

import { CSSProperties } from "react";

interface ButtonProps {
  className?: string;
  imgSrc?: string;
  imgAlt?: string;
  imgSrc1?: string;
  imgAlt1?: string;
  href?: string;
  style? : CSSProperties,
  iconStyle?: string;
  btnContentClassname?: string;
  titleClassname?: string;
  titleClassname1?: string;
  buttonContent? : string | React.ReactNode
  iconClass?: any;
  disabled?: boolean;
  title?: string;
  title1?: string | number;
  onClick?: (e : any) => void;
  onClick1?: () => void;
  btnType?: string;
}

const Button: React.FC<ButtonProps> = ({
  className,
  iconClass,
  style,
  imgAlt,
  imgSrc,
  imgAlt1,
  imgSrc1,
  buttonContent,
  btnContentClassname,
  titleClassname,
  titleClassname1,
  disabled,
  title,
  title1,
  onClick,
  btnType,
}) => {
  return (
    <button
    disabled={disabled}
      style={style}
      type={`${typeof btnType != "undefined" && btnType.length > 0 ? "submit" : "button"}`}
      onClick={onClick}
      className={`btn-default cursor-pointer
        ${typeof className != "undefined" && className.length > 0 ? className : ""}`}
    >
      {/* {typeof iconClass != "undefined" && iconClass.length > 0 ? ( */}

      {/* ) : (
      <></>
    )} */}

      {/* {typeof iconImg != "undefined" && iconImg.length > 0 ? (
      <Image src={iconImg} alt={altImg} priority />
    ) : (
      <></>
    )} */}

      <span>
      {/* <FontAwesomeIcon className={iconStyle} icon={iconClass || faHome} /> */}
      <span className={titleClassname1}>{title1}</span>
      </span><i className={iconClass || ""}></i>
      <span className={titleClassname}>{title}</span>
      <span className={btnContentClassname || "flex justify-center"}>
      {buttonContent}
      <img src={imgSrc} alt={imgAlt} />
      <img src={imgSrc1} alt={imgAlt1} />
     </span>
    </button>
  );

};
export default Button;
