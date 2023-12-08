import { useState } from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

function PlusMinusButton() {
  const [count, setCount] = useState(0); 

  // handle button tambah
  const increment = () => {
    setCount(count + 1);
  };

  // handle button kurang
  const decrement = () => {
    if (count > 0) {
      setCount(count - 1);
    }
  };

  return (
    <div style={{ marginLeft: '-50px' }}>
      <button onClick={decrement} className="btn btn-light btn-sm text-dark">
        <AiOutlineMinus className="text-sm text-md" />
      </button>
      <span className="text-dark" style={{ marginLeft: '10px', marginRight: '10px' }}>{count}</span>
      <button onClick={increment} className="btn btn-light btn-sm text-dark">
        <AiOutlinePlus className="text-sm text-md" />
      </button>
    </div>
  );
}

export default PlusMinusButton;
