import { Component } from "react";
import { Col, Container, Row } from "react-bootstrap";
import CenterBox from "../../components/CenterBox";
import RemoteTimer from "../../components/Timer/RemoteTimer";
import { answerSelected } from "../../connection/config";
import { V_WAITING } from "./views";
import { toLetter } from "../../utilities";

import "./Question.css";

class Question extends Component {

    answer(answer, index) {
        const { question } = this.props;
        const numAnswers = question.answers.filter(a => a && a.trim()).length;
        const isFourAnswers = numAnswers <= 4;
        return (
            <Col lg={isFourAnswers ? 6 : 4} md={6} sm={12} key={index}>
                <div className="player-answer" onClick={() => this.selectAnswer(index)}>
                    <div className="player-answer-letter">{toLetter(index)}</div>
                    {answer}
                </div>
            </Col>
        );
    }

    QuestionGrid = () => {
        const { question } = this.props;
        return (
            <div>
                <Row>
                    <Col xs={12}>
                        <div className="player-question">
                            {question.question}
                            {question.imageUrl && (
                                <div className="player-question-image">
                                    <img 
                                        src={question.imageUrl} 
                                        alt="Question Image" 
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'block';
                                        }} 
                                    />
                                    <div style={{ display: 'none', color: 'red', marginTop: '10px' }}>Image failed to load</div>
                                </div>
                            )}
                        </div>
                    </Col>
                    {question.answers.map((answer, index) => answer && answer.trim() ? this.answer(answer, index) : null)}
                </Row>
            </div>
        );
    };

    selectAnswer = number => {
        if (this.props.question) {
            this.props.selected(number);
            this.props.socket.emit(
                answerSelected,
                this.props.game.roomCode,
                this.props.game.playerName,
                this.props.question.index,
                number
            );
            this.props.switchState(V_WAITING);
        }
    };

    render() {
        return (
            <CenterBox logo cancel="Exit" {...this.props}>
                <div className="message-box">
                    {this.props.game.hostingRoom.timeLimit > 0 && (
                        <RemoteTimer seconds={this.props.timer} />
                    )}
                    <br />
                    <Container fluid>
                        {this.props.question ? this.QuestionGrid() : false}
                    </Container>
                </div>
            </CenterBox>
        );
    }
}

export default Question;
