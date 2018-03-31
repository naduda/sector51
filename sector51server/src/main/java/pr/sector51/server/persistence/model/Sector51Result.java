package pr.sector51.server.persistence.model;

public class Sector51Result {
    private Object message;
    private ESector51Result result;

    public Sector51Result(ESector51Result result) {
        this.result = result;
    }

    public Sector51Result(String message, ESector51Result result) {
        this.message = message;
        this.result = result;
    }

    public Object getMessage() {
        return message;
    }

    public void setMessage(Object message) {
        this.message = message;
    }

    public ESector51Result getResult() {
        return result;
    }

    public void setResult(ESector51Result result) {
        this.result = result;
    }
}
