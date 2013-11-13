import java.nio.ByteBuffer;
import java.nio.ByteOrder;


public class main {
  public static String bytesToHex(byte[] a) {
     StringBuilder sb = new StringBuilder();
     for(byte b: a)
        sb.append(String.format(" %02x", b&0xff));
     return "<ByteBuffer" + sb.toString() + ">";
  }

  /**
   * @param args
   */
  public static void main(String[] args) {
    // TODO Auto-generated method stub
    ByteBuffer bytes = ByteBuffer.allocate(8);
    bytes.putDouble(1);
    System.out.println(bytesToHex(bytes.array()));

    bytes.putDouble(0, 0);
    System.out.println(bytesToHex(bytes.array()));

    bytes.putDouble(0, 2);
    System.out.println(bytesToHex(bytes.array()));

    bytes.putDouble(0, 1024);
    System.out.println(bytesToHex(bytes.array()));

    bytes.order(ByteOrder.LITTLE_ENDIAN);
    bytes.putDouble(0, 1);
    System.out.println(bytesToHex(bytes.array()));

    bytes.putDouble(0, 1024);
    System.out.println(bytesToHex(bytes.array()));

    bytes.order(ByteOrder.BIG_ENDIAN);
    bytes.putDouble(0, 1123123.123123);
    System.out.println(bytesToHex(bytes.array()));

    bytes.order(ByteOrder.LITTLE_ENDIAN);
    bytes.putDouble(0, 1123123.123123);
    System.out.println(bytesToHex(bytes.array()));

    System.out.println("putFloat");
    bytes = ByteBuffer.allocate(4);
    bytes.order(ByteOrder.BIG_ENDIAN);
    bytes.putFloat(0, -91.99999f);
    System.out.println(bytesToHex(bytes.array()));
    bytes.putFloat(0, -100);
    System.out.println(bytesToHex(bytes.array()));
    bytes.putFloat(0, -1);
    System.out.println(bytesToHex(bytes.array()));
    bytes.putFloat(0, 0);
    System.out.println(bytesToHex(bytes.array()));
    bytes.putFloat(0, 1);
    System.out.println(bytesToHex(bytes.array()));
    bytes.putFloat(0, 2);
    System.out.println(bytesToHex(bytes.array()));
    bytes.putFloat(0, 100);
    System.out.println(bytesToHex(bytes.array()));
    bytes.putFloat(0, 999);
    System.out.println(bytesToHex(bytes.array()));
    bytes.putFloat(0, 99.999f);
    System.out.println(bytesToHex(bytes.array()));
    bytes.putFloat(0, 1024);
    System.out.println(bytesToHex(bytes.array()));
    bytes.putFloat(0, 12312877347.123123f);
    System.out.println(bytesToHex(bytes.array()));

    System.out.println("putInt");
    bytes = ByteBuffer.allocate(4);
    bytes.order(ByteOrder.BIG_ENDIAN);
    bytes.putInt(0, -91);
    System.out.println(bytesToHex(bytes.array()));
    bytes.putInt(0, -100);
    System.out.println(bytesToHex(bytes.array()));
    bytes.putInt(0, -1);
    System.out.println(bytesToHex(bytes.array()));
    bytes.putInt(0, 0);
    System.out.println(bytesToHex(bytes.array()));
    bytes.putInt(0, 1);
    System.out.println(bytesToHex(bytes.array()));
    bytes.putInt(0, 2);
    System.out.println(bytesToHex(bytes.array()));
    bytes.putInt(0, 100);
    System.out.println(bytesToHex(bytes.array()));
    bytes.putInt(0, 999);
    System.out.println(bytesToHex(bytes.array()));
    bytes.putInt(0, 99999);
    System.out.println(bytesToHex(bytes.array()));
    bytes.putInt(0, 1024);
    System.out.println(bytesToHex(bytes.array()));

    bytes.putInt(0, -2147483648);
    System.out.println(bytesToHex(bytes.array()));
    bytes.putInt(0, -2147483647);
    System.out.println(bytesToHex(bytes.array()));

    bytes.putInt(0, 2147483647);
    System.out.println(bytesToHex(bytes.array()));
    bytes.putInt(0, 2147483646);
    System.out.println(bytesToHex(bytes.array()));

    System.out.println("putLong");
    bytes = ByteBuffer.allocate(8);
    bytes.order(ByteOrder.BIG_ENDIAN);
    bytes.putLong(0, -91);
    System.out.println(bytesToHex(bytes.array()));
    bytes.putLong(0, -100);
    System.out.println(bytesToHex(bytes.array()));
    bytes.putLong(0, -1);
    System.out.println(bytesToHex(bytes.array()));
    bytes.putLong(0, 0);
    System.out.println(bytesToHex(bytes.array()));
    bytes.putLong(0, 1);
    System.out.println(bytesToHex(bytes.array()));
    bytes.putLong(0, 2);
    System.out.println(bytesToHex(bytes.array()));
    bytes.putLong(0, 100);
    System.out.println(bytesToHex(bytes.array()));
    bytes.putLong(0, 999);
    System.out.println(bytesToHex(bytes.array()));
    bytes.putLong(0, 99999);
    System.out.println(bytesToHex(bytes.array()));
    bytes.putLong(0, 1024);
    System.out.println(bytesToHex(bytes.array()));

    bytes.putLong(0, -2147483648);
    System.out.println(bytesToHex(bytes.array()));
    bytes.putLong(0, -2147483647);
    System.out.println(bytesToHex(bytes.array()));

    bytes.putLong(0, 2147483647);
    System.out.println(bytesToHex(bytes.array()));
    bytes.putLong(0, 2147483646);
    System.out.println(bytesToHex(bytes.array()));


    System.out.println(Long.MIN_VALUE);
    bytes.putLong(0, Long.MIN_VALUE);
    System.out.println(bytesToHex(bytes.array()));
    System.out.println(Long.MAX_VALUE);
    bytes.putLong(0, Long.MAX_VALUE);
    System.out.println(bytesToHex(bytes.array()));
  }

}
