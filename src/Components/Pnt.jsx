import React from 'react';
import { Button, Result } from 'antd';
const Pnt = () => (
  <Result
    status="warning"
    title="There are some problems with your operation."
    extra={
      <Button type="primary" key="console">
        Go Console
      </Button>
    }
  />
);
export default Pnt;