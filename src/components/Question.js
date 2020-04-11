import React from 'react';
import { Form, Radio } from 'antd';
import formItemLayout from '../constants/formwrappercss';
import { connect } from 'react-redux'
class Question extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "None",
    };
  }
  onChange (e){
    this.props.addData({ id: e.target.value, number: this.props.item.number, question: this.props.item.question }, 'ADD').then(() => {
      console.log(this.props.data.sort((a, b) => (a.number > b.number) ? 1 : -1))
    })
    this.setState({
      value: e.target.value,
    })
  }
  render() {
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };
    const { value } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="container question">
        <center><h3>Question {this.props.index}/{this.props.total}</h3></center>
        <div className="card">
          <div className="card-header mt-2">
            <h5>{this.props.item.question}</h5>
          </div>

        </div>
        <Radio.Group onChange={this.onChange.bind(this)} value={value}>
          {this.props.item.answers.map(({ id, answer }, i) => (
            <strong key={i+answer+this.props.item.question}>
              <Radio style={radioStyle} value={id}>
                {answer}
              </Radio>
            </strong>
          ))}
        </Radio.Group>

      </div>

    );
  }
}
const FirstForm = Form.create({})(Question);

const mapDispatchToProps = (dispatch) => {
  return {
    addData: (data) => new Promise(
      resolve => {
        dispatch({ type: 'ADD', payload: data });
        resolve()
      })
  }
}
const mapStateToProps = (state) => {
  return {
    data: state.data
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(FirstForm);