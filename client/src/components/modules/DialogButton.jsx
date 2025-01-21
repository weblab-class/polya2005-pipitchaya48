import React, { useState, useCallback, useEffect } from "react";
import { clsx } from "clsx";
import { styled } from "@mui/system";
import { Modal as BaseModal, Button } from "@mui/base";
import { Fade } from "@mui/material";

export function DialogButton({
  rootClassName = "w-full",
  children,
  className,
  disabled,
  title,
  description,
  dismissButtonText = "Dismiss",
  dismissButtonClassName,
  confirmButton,
  handleCloseRef,
  afterClose = () => {},
}) {
  const [open, setOpen] = useState(false);
  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => {
    setOpen(false);
    afterClose();
  }, []);

  useEffect(() => {
    if (handleCloseRef) {
      handleCloseRef.current = handleClose;
    }
  });

  return (
    <div className={rootClassName}>
      <Button
        className={className}
        type="button"
        disabled={disabled}
        onClick={() => {
          handleOpen();
        }}
      >
        {children}
      </Button>
      <Modal
        className="flex items-center justify-center fixed z-1300 aria-hidden"
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
        open={open}
        onClose={handleClose}
        slots={{ backdrop: StyledBackdrop }}
      >
        <Fade in={open}>
          <div className="bg-white rounded-lg p-m flex flex-col gap-m m-s">
            <h2 id="keep-mounted-modal-title" className="modal-title text-xl">
              {title}
            </h2>
            <div
              id="keep-mounted-modal-description"
              className="modal-description flex flex-col gap-s"
            >
              {description}
            </div>
            <div className="flex justify-end gap-s">
              {confirmButton}
              <Button
                className={clsx("p-s rounded-lg", dismissButtonClassName)}
                onClick={handleClose}
                type="button"
              >
                {dismissButtonText}
              </Button>
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

const Backdrop = React.forwardRef((props, ref) => {
  const { open, className, ...other } = props;
  return <div className={clsx({ "base-Backdrop-open": open }, className)} ref={ref} {...other} />;
});

const Modal = styled(BaseModal)`
  position: fixed;
  z-index: 1300;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledBackdrop = styled(Backdrop)`
  z-index: -1;
  position: fixed;
  inset: 0;
  background-color: rgb(0 0 0 / 0.5);
  -webkit-tap-highlight-color: transparent;
`;
