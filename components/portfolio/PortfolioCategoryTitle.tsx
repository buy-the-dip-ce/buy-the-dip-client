import React, { useState, useRef, useEffect, useMemo } from "react";
import styled from "styled-components";
import Image from "next/image";
import { editCategoryNameAPI } from "../../lib/api/portfolio";
import { useRouter } from "next/router";
import { useQueryClient } from "react-query";

const Input = styled.input`
  border: 0;
  border-bottom: 2px solid;
  font-size: var(--medium2);
  color: var(--black500);
  font-weight: bold;
`;

const Category = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: var(--medium2);
  color: var(--black500);
  font-weight: bold;
  cursor: pointer;
  h4 {
    margin-right: var(--small3);
  }
`;

const PortfolioCategoryTitle: React.FC<{ category: string }> = ({ category }) => {
  const [editable, setEditable] = useState(false);
  const [name, setName] = useState("");

  const { query } = useRouter();

  const portfolioId = useMemo(() => query["id"], [query]);

  const ref = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (ref.current && editable) {
      ref.current.focus();
    }
  }, [editable]);

  const editCategoryName = async () => {
    try {
      await editCategoryNameAPI(portfolioId as string, category, { prevName: category, name });
      setEditable(false);
      queryClient.resetQueries(["get-portfolio", query["id"]]);
    } catch (e) {
      console.log(e);
    }
  };

  if (editable) {
    return (
      <Input
        ref={ref}
        value={name}
        onKeyDown={(e) => {
          if (e.keyCode === 13) {
            editCategoryName();
          }
        }}
        onBlur={() => {
          editCategoryName();
        }}
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
    );
  }
  return (
    <Category
      className={"category"}
      onClick={() => {
        setEditable(true);
      }}>
      <h4>{category}</h4>
      <Image src="/static/pencil.svg" alt="home" width={18} height={18} />
    </Category>
  );
};

export default PortfolioCategoryTitle;
