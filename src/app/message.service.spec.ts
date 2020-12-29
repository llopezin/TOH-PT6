import { TestBed } from '@angular/core/testing';
import { MessageService } from './message.service';

describe('MessageService', () => {
  let service: MessageService;
  let messagesLength: number;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [MessageService] });
    service = TestBed.inject(MessageService);
    messagesLength = service.messages.length;
  });

  it('should add a message', () => {
    service.add('test message');
    expect(service.messages.length).toBe(messagesLength + 1);
  });

  it('should add message containing given text', () => {
    service.add('test message');
    expect(service.messages.pop()).toBe('test message');
  });

  it('should clear messages list when no messages', () => {
    service.messages = [];
    service.clear();
    expect(service.messages).toEqual([]);
  });

  it('should clear messages list', () => {
    service.messages = ['test message', 'test message'];
    service.clear();
    expect(service.messages).toEqual([]);
  });
});
