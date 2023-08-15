import App from "./App";
import './index.css'

export async function fetchData() {
  return {
    user: 'xxx'
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ServerEntry(props: any) {
  return (
    <App data={props.data}/>
  );
}
