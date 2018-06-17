package pr.sector51.server.persistence.model;

import java.sql.Timestamp;

public class BoxNumber {
  private int idtype;
  private int number;
  private String card;
  private Timestamp time;

  private BoxNumber() { }

  public BoxNumber(int idtype, int number) {
    this();
    this.idtype = idtype;
    this.number = number;
  }

  public int getIdtype() {
    return idtype;
  }

  public void setIdtype(int idtype) {
    this.idtype = idtype;
  }

  public int getNumber() {
    return number;
  }

  public void setNumber(int number) {
    this.number = number;
  }

  public String getCard() {
    return card;
  }

  public void setCard(String card) {
    this.card = card;
  }

  public Timestamp getTime() {
    return time;
  }

  public void setTime(Timestamp time) {
    this.time = time;
  }
}
