import { useState } from "react";

import styled from "styled-components";
import ModalPortal from "../Modal";
import SearchStockModal from "./SearchStockModal";

const Container = styled.button`
  height: 36px;
  padding: 8px 12px;
  border: 1px solid var(--grey500);
  background-color: var(--grey300);
  font-size: var(--medium1);
  border-radius: var(--small3);
  cursor: pointer;
`;

const AddStockButton: React.FC<{ category: string }> = ({ category }) => {
  const [showModal, setShowModal] = useState(false);

  const onClick = () => {
    setShowModal(true);
  };

  return (
    <>
      <Container type="button" onClick={onClick}>
        + 주식 추가하기
      </Container>
      {showModal && (
        <ModalPortal
          closePortal={() => {
            setShowModal(false);
          }}>
          <SearchStockModal category={category} setShowModal={setShowModal} />
        </ModalPortal>
      )}
    </>
  );
};

export default AddStockButton;
