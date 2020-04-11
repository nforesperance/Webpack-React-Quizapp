import { Button, Form, Steps } from 'antd';
import 'antd/dist/antd.css';
import React from 'react';
import { connect } from 'react-redux';
import Question from './Question';
import Last from './Verify';
import axios from 'axios';
import route from '../constants/settings';





class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      visble: false,
      infos: [],
      questions: [],
      quiz_name:''
    };
  }
  componentDidMount() {
    axios.get(route.get_questions + document.getElementById("quiz_id").value)
      .then(res => {
        this.arrangeQuestions(res.data.quiz, res.data.max,res.data.name)

      })

  }
  arrangeQuestions(quiz, max,quiz_name) {
    let questions = []
    quiz.forEach(elt => {
      let answers = [
        {
          "id": "A",
          "answer": elt.A
        },
        {
          "id": "B",
          "answer": elt.B
        },
        {
          "id": "C",
          "answer": elt.C
        },
        {
          "id": "D",
          "answer": elt.D
        },

      ]
      let question = {
        "number": elt.number,
        "question": elt.question,
        "correct": elt.correct,
        "answers": answers
      }
      questions.push(question)
    });
    // Shuffling the array to produce random questions
    Array.prototype.shuffle = function () {
      let m = this.length, i;
      while (m) {
        i = (Math.random() * m--) >>> 0;
        [this[m], this[i]] = [this[i], this[m]]
      }
      return this;
    }
    questions.shuffle();
    let display = []
    // Lets ensure that Max is les than total number of questions
    let maxnumber = max < quiz.length ? max : quiz.length

    for (let index = 0; index < maxnumber; index++) {
      display.push(questions[index]);

    }
    this.setState({ questions: display,quiz_name })
  }
  next() {

    const current = this.state.current + 1;
    this.setState({ current });

  }
  prev() {
    const current = this.state.current - 1;
    // console.log(current)
    this.setState({ current });
  }
  render() {
    const { Step } = Steps;
    const { current } = this.state;
    let steps = []
    this.state.questions.map((item, index) => {
      steps.push(
        {
          title: "Step x",
          content: <Question form={this.props.form} item={item} index={index + 1} total={this.state.questions.length} />
        }
      )
    })
    steps.push(
      {
        title: "Step 4",
        content: <Last form={this.props.form} questions={this.state.questions} />
      }
    )
    return (
      <div className="steps" >
        {/* <Steps current={current}>
          {steps.map((item ,index) => (
            <Step key={index} title={item.title} />
          ))}
        </Steps> */}
        <center><h3>{this.state.quiz_name}</h3></center>
        {steps.map(({ title, content }, i) => (
          <div
            key={title + i}
            className={i === this.state.current ? "foo fade-in" : "foo"}
          >
            {content}
          </div>
        ))}
        <div className="steps-action">
          {current > 0 && (
            <Button style={{ marginLeft: 8 }} onClick={() => this.prev()} className="but">
              Previous
            </Button>
          )}
          {current < steps.length - 2 && (
            <Button type="primary" onClick={() => this.next()} id="suivant" className="but">
              Next
            </Button>
          )}
          {current === steps.length - 2 && (
            <Button type="primary" onClick={() => this.next()} id="suivant" className="but">
              Finish
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button style={{ marginRight: 8 }} type="primary" onClick={() => this.getAllData()} id="suivant" className="but">
              Sumit
            </Button>
          )}
        </div>

      </div>
    );
  }
}
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
const MainForm = Form.create({})(Main);

export default connect(mapStateToProps, mapDispatchToProps)(MainForm);
