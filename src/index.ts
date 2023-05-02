import crypto from "crypto";

interface BlockShape {
  hash: string;
  prevHash: string;
  height: number;
  data: string;
}

class Block implements BlockShape {
  public hash: string;
  constructor(
    public prevHash: string,
    public height: number,
    public data: string
  ) {
    this.hash = Block.calculateHash(prevHash, height, data);
  }
  static calculateHash(prevHash: string, height: number, data: string) {
    const toHash = `${prevHash}${height}${data}`;
    return crypto.createHash("sha256").update(toHash).digest("hex");
  }
}

class Blockchain {
  private blocks: Block[];
  constructor() {
    this.blocks = [];
  }
  private getPrevHash() {
    if (this.blocks.length === 0) return "";
    return this.blocks[this.blocks.length - 1].hash;
  }
  public addBlock(data: string) {
    const newBlock = new Block(
      this.getPrevHash(),
      this.blocks.length + 1,
      data
    );
    this.blocks.push(newBlock);
  }
  public getBlocks() {
    return [...this.blocks];
  }
}

const blockchain = new Blockchain();
blockchain.addBlock("I am first");
blockchain.addBlock("I am second");
blockchain.addBlock("I am third");
blockchain.addBlock("I am fourth");

console.log(blockchain.getBlocks());

function Emoji() {
  return function (target: any, key: string | symbol) {
    let val = target[key];
    const getter = () => {
      return val;
    };
    const setter = (next: any) => {
      val = `sdf${next}sdf`;
    };
    Object.defineProperty(target, key, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true,
    });
  };
}

function Confirmable(message: string) {
  return function (
    target: any,
    key: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const original = descriptor.value;
    descriptor.value = function (...args: any[]) {
      const allow = confirm(message);
      if (allow) {
        const result = original.apply(this, args);
        return result;
      } else {
        return null;
      }
    };
  };
}

function WithTax(rate: number) {
  return function (
    target: any,
    key: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const original = descriptor.get;
    descriptor.get = function () {
      const result = original?.apply(this);
      return (result * (1 + rate)).toFixed(2);
    };
    return descriptor;
  };
}

class IceCream {
  @Emoji()
  flavor = "vanila";

  toppings: any[] = [];

  @Confirmable("You sure?")
  addTopping(topping = "sprinks") {
    this.toppings.push(topping);
  }

  @WithTax(0.15)
  get price() {
    return 5.0 + 0.25 * this.toppings.length;
  }
}

const ice = new IceCream();
console.log(ice.flavor);
ice.flavor = "squirrel";
console.log(ice.flavor);
console.log(ice.price);
